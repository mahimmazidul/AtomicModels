import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { ElementData } from "../data/elements";
import type { ModelKey } from "../data/models";
import { discScatter, gasdev, mulberry32 } from "../lib/prng";

/* ————————————————————————————————————————————————
   The measuring stage. Everything here is a schematic,
   drawn procedurally from the element’s real shell data —
   and annotated as such, on the drawing itself.
   ———————————————————————————————————————————————— */

const C = 300;
const PAPER = "rgba(233,228,214,1)";
const FOG = "rgba(233,228,214,0.55)";
const E_CORE = "#9be8f2";
const E_HALO = "rgba(53,189,208,0.30)";
const N_RED = "#e5483c";
const N_GREY = "#cfc9ba";

const mono: CSSProperties = {
  fontFamily: "IBM Plex Mono, monospace",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

function Electron({ x, y, r = 6 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2.1} fill={E_HALO} />
      <circle cx={x} cy={y} r={r} fill={E_CORE} stroke="rgba(12,12,15,0.55)" strokeWidth={0.8} />
    </g>
  );
}

function Nucleus({ z, seed, spread = 15, charge }: { z: number; seed: number; spread?: number; charge?: boolean }) {
  const pts = useMemo(() => {
    const total = z === 1 ? 1 : Math.min(Math.ceil(z * 1.55), 22);
    return discScatter(total, spread, seed, 0.3);
  }, [z, seed, spread]);
  return (
    <g>
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={C + p.x}
          cy={C + p.y}
          r={4.4}
          fill={i % 2 === 0 ? N_RED : N_GREY}
          opacity={0.92}
          stroke="rgba(12,12,15,0.5)"
          strokeWidth={0.6}
        />
      ))}
      {charge && (
        <text x={C} y={C + spread + 20} textAnchor="middle" fontSize={10.5} fill={FOG} style={mono}>
          charge +{z}
        </text>
      )}
    </g>
  );
}

function Annotation({ x, y, children, anchor = "middle", opacity = 0.5 }: { x: number; y: number; children: ReactNode; anchor?: string; opacity?: number }) {
  return (
    <text x={x} y={y} textAnchor={anchor as never} fontSize={10} fill={FOG} opacity={opacity} style={mono}>
      {children}
    </text>
  );
}

/* ————— I · DALTON — a solid, engraved sphere ————— */

function DaltonViz({ el, seed }: { el: ElementData; seed: number }) {
  void seed;
  const hatch = useMemo(() => {
    const lines: number[] = [];
    for (let i = -26; i <= 26; i++) lines.push(i * 11);
    return lines;
  }, []);
  return (
    <g>
      <defs>
        <radialGradient id="daltonShade" gradientUnits="userSpaceOnUse" cx={250} cy={228} r={330}>
          <stop offset="0%" stopColor="#f4f0e3" />
          <stop offset="52%" stopColor="#b3ac9b" />
          <stop offset="100%" stopColor="#57534a" />
        </radialGradient>
        <clipPath id="daltonClip">
          <circle cx={C} cy={C} r={170} />
        </clipPath>
      </defs>

      <circle cx={C} cy={C} r={212} fill="none" stroke={FOG} strokeOpacity={0.22} strokeDasharray="2 7" />
      <Annotation x={C} y={C - 226} opacity={0.45}>
        atomic edge — drawn to imply size; size itself is undefined here
      </Annotation>

      <circle cx={C} cy={C} r={170} fill="url(#daltonShade)" />
      <g clipPath="url(#daltonClip)">
        <g
          className="spin-slow"
          style={{ ["--d" as never]: "110s", transformBox: "view-box", transformOrigin: "50% 50%" }}
        >
          {hatch.map((o) => (
            <line
              key={o}
              x1={110}
              y1={C + o - 170}
              x2={490}
              y2={C + o + 170}
              stroke="#0c0c0f"
              strokeOpacity={0.1}
              strokeWidth={1}
            />
          ))}
        </g>
      </g>
      <circle cx={C} cy={C} r={170} fill="none" stroke="#0c0c0f" strokeOpacity={0.55} strokeWidth={1.4} />
      <circle cx={C} cy={C} r={170} fill="none" stroke={PAPER} strokeOpacity={0.35} strokeWidth={0.6} />

      <text
        x={C}
        y={C + 34}
        textAnchor="middle"
        fontSize={108}
        fontFamily="Fraunces, serif"
        fontWeight={500}
        fill="#141410"
        opacity={0.92}
        style={{ fontStyle: "italic" }}
      >
        {el.sym}
      </text>
      <Annotation x={C} y={C + 76} opacity={0.7}>
        indivisible · identical · count: one
      </Annotation>
    </g>
  );
}

/* ————— II · THOMSON — plums in a neutral jelly ————— */

function ThomsonViz({ el, seed }: { el: ElementData; seed: number }) {
  const drawn = Math.min(el.z, 30);
  const pts = useMemo(() => discScatter(drawn, 168, seed, 0.14), [drawn, seed]);
  return (
    <g>
      <defs>
        <radialGradient id="thomsonJelly">
          <stop offset="0%" stopColor="#e9e4d6" stopOpacity={0.02} />
          <stop offset="62%" stopColor="#e9e4d6" stopOpacity={0.09} />
          <stop offset="100%" stopColor="#e9e4d6" stopOpacity={0.22} />
        </radialGradient>
      </defs>

      <circle cx={C} cy={C} r={198} fill="url(#thomsonJelly)" stroke={PAPER} strokeOpacity={0.4} strokeWidth={1.2} />
      <Annotation x={C} y={C - 218} opacity={0.5}>
        positive charge — uniform “jelly”, no nucleus
      </Annotation>
      <Annotation x={C} y={C + 232} opacity={0.5}>
        {drawn === el.z ? `${drawn} electron${drawn > 1 ? "s" : ""} embedded` : `${drawn} of ${el.z} electrons drawn — schematic`}
      </Annotation>

      <g
        className="orbit"
        style={{ ["--d" as never]: "150s", transformBox: "view-box", transformOrigin: "50% 50%" }}
      >
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={C + p.x} cy={C + p.y} r={8} fill="#0d0d10" stroke={PAPER} strokeOpacity={0.75} strokeWidth={1} />
            <line x1={C + p.x - 3} x2={C + p.x + 3} y1={C + p.y} y2={C + p.y} stroke={PAPER} strokeWidth={1.2} />
          </g>
        ))}
      </g>
    </g>
  );
}

/* ————— III · RUTHERFORD — a speck, then mostly nothing ————— */

function RutherfordViz({ el, seed }: { el: ElementData; seed: number }) {
  const drawn = Math.min(el.z, 18);
  const orbits = useMemo(() => {
    const tilts = [-28, 26, 92];
    const rxs = [176, 212, 248];
    const s = 0.33;
    const weights = [2, 3, 4];
    const total = weights.reduce((a, b) => a + b, 0);
    let placed = 0;
    return tilts.map((tilt, i) => {
      const n =
        i === tilts.length - 1 ? drawn - placed : Math.round(drawn * (weights[i] / total));
      placed += n;
      const dots = Array.from({ length: n }, (_, k) => {
        const a = (k / Math.max(n, 1)) * Math.PI * 2 + i * 0.9;
        return { x: C + rxs[i] * Math.cos(a), y: C + rxs[i] * Math.sin(a) };
      });
      return { tilt, rx: rxs[i], s, dots, d: `${8 + i * 3.5}s`, rev: i === 1 };
    });
  }, [drawn]);

  void seed;
  return (
    <g>
      {/* the whole atom — drawn honestly as void */}
      <circle cx={C} cy={C} r={272} fill="none" stroke={FOG} strokeOpacity={0.25} strokeDasharray="2 7" />
      <Annotation x={C} y={C - 280} opacity={0.5}>
        ∅(atom) ≈ 10⁻¹⁰ m — the rest is empty
      </Annotation>

      {orbits.map((o, i) => (
        <g key={i} transform={`rotate(${o.tilt} ${C} ${C})`}>
          <ellipse cx={C} cy={C} rx={o.rx} ry={o.rx * o.s} fill="none" stroke={PAPER} strokeOpacity={0.26} strokeWidth={1} />
          <g transform={`translate(${C} ${C}) scale(1 ${o.s}) translate(${-C} ${-C})`}>
            <g
              className={o.rev ? "orbit-rev" : "orbit"}
              style={{ ["--d" as never]: o.d, transformBox: "view-box", transformOrigin: "50% 50%" }}
            >
              {o.dots.map((p, k) => (
                <Electron key={k} x={p.x} y={p.y} r={5.4} />
              ))}
            </g>
          </g>
        </g>
      ))}

      <Nucleus z={el.z} seed={seed + 7} spread={13} />
      <Annotation x={C} y={C + 46} opacity={0.55}>
        nucleus ≈ 10⁻¹⁵ m
      </Annotation>
      {el.z > 18 && (
        <Annotation x={C} y={C + 285} opacity={0.45}>
          {drawn} of {el.z} electrons drawn — schematic
        </Annotation>
      )}
    </g>
  );
}

/* ————— IV · BOHR — rungs, and only rungs ————— */

function BohrViz({ el, seed }: { el: ElementData; seed: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const n = el.shells.length;
  const radii = useMemo(() => {
    if (n === 1) return [92];
    const spacing = Math.min(43, 212 / (n - 1));
    return el.shells.map((_, i) => 58 + i * spacing);
  }, [el, n]);

  return (
    <g>
      {radii.map((r, i) => {
        const active = hover === null || hover === i;
        const count = el.shells[i];
        const dots = Array.from({ length: count }, (_, k) => {
          const a = (k / count) * Math.PI * 2 + i * 0.7;
          return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
        });
        const lx = C + r * Math.cos(-0.56);
        const ly = C + r * Math.sin(-0.56);
        return (
          <g key={i} opacity={active ? 1 : 0.18} style={{ transition: "opacity .3s" }}>
            <circle
              cx={C}
              cy={C}
              r={r}
              fill="none"
              stroke={hover === i ? "#35bdd0" : PAPER}
              strokeOpacity={hover === i ? 0.95 : 0.3}
              strokeWidth={hover === i ? 1.4 : 1}
            />
            <g
              className={i % 2 === 0 ? "orbit" : "orbit-rev"}
              style={{ ["--d" as never]: `${5.5 + i * 2.8}s`, transformBox: "view-box", transformOrigin: "50% 50%" }}
            >
              {dots.map((p, k) => (
                <Electron key={k} x={p.x} y={p.y} r={hover === i ? 6.4 : 5.4} />
              ))}
            </g>
            <text
              x={lx}
              y={ly}
              fontSize={9.5}
              fill={hover === i ? "#9be8f2" : FOG}
              style={{ ...mono, paintOrder: "stroke" }}
              stroke="#0c0c0f"
              strokeWidth={4}
            >
              n={i + 1}
            </text>
            {/* fat invisible hit ring */}
            <circle
              cx={C}
              cy={C}
              r={r}
              fill="none"
              stroke="transparent"
              strokeWidth={22}
              style={{ pointerEvents: "stroke", cursor: "crosshair" }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          </g>
        );
      })}

      <Nucleus z={el.z} seed={seed + 13} spread={13} charge />

      <Annotation x={C} y={Math.min(C + (radii[radii.length - 1] || 60) + 34, 588)} opacity={0.55}>
        {hover === null
          ? "fixed rungs only — nothing in between"
          : `shell n=${hover + 1} · ${el.shells[hover]} electron${el.shells[hover] > 1 ? "s" : ""}`}
      </Annotation>
    </g>
  );
}

/* ————— V · QUANTUM — the end of the path ————— */

function QuantumViz({ el, seed }: { el: ElementData; seed: number }) {
  const n = el.shells.length;
  const radii = useMemo(() => {
    if (n === 1) return [92];
    const spacing = Math.min(43, 212 / (n - 1));
    return el.shells.map((_, i) => 58 + i * spacing);
  }, [el, n]);
  const maxShell = Math.max(...el.shells);

  const specks = useMemo(() => {
    const rand = mulberry32(seed + 29);
    const spacing = radii.length > 1 ? radii[1] - radii[0] : 42;
    const out: { x: number; y: number; r: number; o: number; c: string }[] = [];
    const totalWeights = el.shells.reduce((a, b) => a + b, 0);
    for (let i = 0; i < 220; i++) {
      let pick = rand() * totalWeights;
      let si = 0;
      for (; si < el.shells.length - 1; si++) {
        if (pick < el.shells[si]) break;
        pick -= el.shells[si];
      }
      const r = radii[si] + gasdev(rand) * spacing * 0.75;
      const a = rand() * Math.PI * 2;
      out.push({
        x: C + Math.max(r, 8) * Math.cos(a),
        y: C + Math.max(r, 8) * Math.sin(a),
        r: 1.1 + rand() * 1.1,
        o: 0.16 + rand() * 0.5,
        c: rand() > 0.8 ? "#5a66e0" : "#35bdd0",
      });
    }
    return out;
  }, [el, seed, radii]);

  return (
    <g>
      <defs>
        <radialGradient id="qCloud">
          <stop offset="0%" stopColor="#35bdd0" stopOpacity={0.34} />
          <stop offset="48%" stopColor="#5a66e0" stopOpacity={0.16} />
          <stop offset="100%" stopColor="#5a66e0" stopOpacity={0} />
        </radialGradient>
        <filter id="qBlur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={16} />
        </filter>
      </defs>

      <circle
        cx={C}
        cy={C}
        r={radii[radii.length - 1] + 30}
        fill="none"
        stroke={FOG}
        strokeOpacity={0.22}
        strokeDasharray="2 7"
      />
      <Annotation x={C} y={Math.max(C - (radii[radii.length - 1] || 60) - 44, 20)} opacity={0.5}>
        where the electron probably is — not where it goes
      </Annotation>

      {radii.map((r, i) => (
        <circle
          key={i}
          cx={C}
          cy={C}
          r={r}
          fill="url(#qCloud)"
          filter="url(#qBlur)"
          opacity={0.34 + 0.6 * (el.shells[i] / maxShell)}
        />
      ))}

      <g
        className="orbit"
        style={{ ["--d" as never]: "240s", transformBox: "view-box", transformOrigin: "50% 50%" }}
      >
        {specks.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.c} opacity={s.o} />
        ))}
      </g>

      <circle cx={C} cy={C} r={9} fill="rgba(53,189,208,0.35)" />
      <circle cx={C} cy={C} r={3.4} fill="#e5fbff" />
      <Annotation x={C} y={C + 30} opacity={0.55}>
        nucleus
      </Annotation>
      <Annotation x={C} y={Math.min(C + (radii[radii.length - 1] || 60) + 42, 590)} opacity={0.55}>
        density ∝ |ψ|² · schematic — not a computed orbital
      </Annotation>
    </g>
  );
}

/* ———————————————————————————————————————————————— */

export default function AtomViz({
  el,
  model,
  className = "",
}: {
  el: ElementData;
  model: ModelKey;
  className?: string;
}) {
  const seed = el.z * 7919 + 17;
  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      role="img"
      aria-label={`${el.name} drawn under the ${model} model — simplified schematic, not to scale`}
    >
      {model === "dalton" && <DaltonViz el={el} seed={seed} />}
      {model === "thomson" && <ThomsonViz el={el} seed={seed} />}
      {model === "rutherford" && <RutherfordViz el={el} seed={seed} />}
      {model === "bohr" && <BohrViz el={el} seed={seed} />}
      {model === "quantum" && <QuantumViz el={el} seed={seed} />}
    </svg>
  );
}
