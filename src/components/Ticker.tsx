import { ELEMENTS, padZ } from "../data/elements";

/** The catalogue ribbon: all 118 specimens scrolling past. Click one to load it. */
export default function Ticker({ onPick }: { onPick?: (z: number) => void }) {
  const items = [...ELEMENTS, ...ELEMENTS];
  return (
    <div
      className="marquee hairline-t hairline-b relative overflow-hidden bg-ink"
      aria-label="Index of all 118 elements"
    >
      <div className="marquee-track" style={{ ["--d" as never]: "160s" }}>
        {items.map((el, i) => (
          <button
            key={`${el.z}-${i}`}
            tabIndex={i >= 118 ? -1 : 0}
            onClick={() => onPick?.(el.z)}
            title={`${el.z} · ${el.name}`}
            className="group flex shrink-0 items-center gap-2 border-l border-[var(--line)] px-4 py-3 font-mono text-[11px] tracking-[0.18em] text-fog transition-colors hover:bg-ink-2 hover:text-paper"
          >
            <span className="opacity-50">{padZ(el.z)}</span>
            <span className="font-semibold text-paper/80 group-hover:text-hbeta transition-colors">
              {el.sym}
            </span>
          </button>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}
