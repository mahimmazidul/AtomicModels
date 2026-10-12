/* The visible spectrum, 380–700 nm, with the Balmer series of hydrogen
   marked — the recurring motif of the archive: we read atoms by light. */

interface Balmer {
  nm: number;
  label: string;
  greek: string;
  color: string;
}

export const BALMER: Balmer[] = [
  { nm: 656.3, label: "656.3", greek: "H-α", color: "#e5483c" },
  { nm: 486.1, label: "486.1", greek: "H-β", color: "#35bdd0" },
  { nm: 434.0, label: "434.0", greek: "H-γ", color: "#5a66e0" },
  { nm: 410.2, label: "410.2", greek: "H-δ", color: "#9462e8" },
];

const pct = (nm: number) => ((nm - 380) / (700 - 380)) * 100;

export default function Spectrum({
  showBalmer = false,
  labelled = false,
  height = 5,
  className = "",
}: {
  showBalmer?: boolean;
  labelled?: boolean;
  height?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {labelled && showBalmer && (
        <div className="relative h-9">
          {BALMER.map((l) => (
            <div
              key={l.greek}
              className="absolute flex translate-x-[-50%] flex-col items-center gap-0.5"
              style={{ left: `${pct(l.nm)}%` }}
            >
              <span
                className="font-mono text-[10px] tracking-[0.18em]"
                style={{ color: `color-mix(in oklab, ${l.color} 62%, var(--color-paper))` }}
              >
                {l.greek}
              </span>
              <span className="font-mono text-[9px] text-fog tracking-[0.12em]">{l.label} nm</span>
            </div>
          ))}
        </div>
      )}
      <div className="relative">
        {showBalmer &&
          BALMER.map((l) => (
            <span
              key={l.greek}
              className="absolute top-[-3px] bottom-[-3px] w-px"
              style={{ left: `${pct(l.nm)}%`, background: l.color }}
            />
          ))}
        <div
          className="spec-bar w-full"
          style={{ height, opacity: showBalmer ? 1 : 0.85 }}
          role="img"
          aria-label="The visible spectrum from 380 to 700 nanometres"
        />
        {/* wavelength ruler ticks */}
        <div className="relative mt-1 h-[7px] w-full text-fog">
          {Array.from({ length: 17 }, (_, i) => {
            const nm = 380 + i * 20;
            return (
              <span
                key={nm}
                className="absolute top-0 w-px bg-current"
                style={{ left: `${pct(nm)}%`, height: i % 4 === 0 ? 7 : 3.5, opacity: i % 4 === 0 ? 0.8 : 0.45 }}
              />
            );
          })}
        </div>
        {labelled && (
          <div className="relative mt-0.5 h-4 w-full font-mono text-[9px] tracking-[0.14em] text-fog">
            <span className="absolute left-0">380 nm</span>
            <span className="absolute left-1/2 -translate-x-1/2">540</span>
            <span className="absolute right-0">700 nm</span>
          </div>
        )}
      </div>
    </div>
  );
}
