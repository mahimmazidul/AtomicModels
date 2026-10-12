import { MODELS } from "../data/models";
import Reveal from "./Reveal";
import Spectrum from "./Spectrum";

/* One hundred and twenty-three years, told as a ledger — each entry carrying
   the experiment that forced the next drawing. */

const EVENTS: Record<string, string> = {
  dalton:
    "Manchester, 1803. A schoolteacher weighs gases and concludes matter is granular. The word “atom” re-enters science with a mass table attached.",
  thomson:
    "Cambridge, 1897. Cathode rays bend inside Crookes tubes: a particle two thousand times lighter than hydrogen. Seven years later it is embedded in pudding.",
  rutherford:
    "Manchester, 1909–11. Geiger and Marsden fire alphas at gold leaf; one in twenty thousand comes back. Rutherford: “as if you fired a 15-inch shell at tissue paper and it returned.”",
  bohr:
    "Copenhagen, 1913. A postdoc forbids electrons from spiralling. The penalty for jumping rungs is exact — four lines of hydrogen’s light, computed to four figures.",
  quantum:
    "Göttingen · Zürich · Berlin, 1925–27. Heisenberg’s matrices, Schrödinger’s wave, Born’s wager: |ψ|² is probability. The path is gone; the table of elements is explained.",
};

export default function Chronicle() {
  return (
    <section id="chronicle" className="relative mx-auto max-w-[1440px] px-5 py-24 sm:px-10 md:py-36">
      <Reveal className="mb-16 flex flex-wrap items-end justify-between gap-6 md:mb-24">
        <div>
          <p className="kicker mb-4">№ 03 · The chronicle</p>
          <h2 className="font-display text-[clamp(2.4rem,5.4vw,4.2rem)] leading-[0.95] tracking-[-0.01em]">
            Every picture, <em className="font-light italic text-hdelta">defeated by data</em>
          </h2>
        </div>
        <p className="max-w-[30ch] pb-1 font-mono text-[11px] leading-relaxed tracking-[0.08em] text-fog">
          READ DOWNWARD. EACH MODEL DIES OF THE EVIDENCE THE PREVIOUS ONE COULD NOT SEE.
        </p>
      </Reveal>

      <div className="relative">
        {/* spine */}
        <span className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--line)] md:left-1/2" aria-hidden />

        {MODELS.map((m, i) => {
          const left = i % 2 === 0;
          return (
            <Reveal key={m.key} className="relative grid gap-6 py-10 pl-10 md:grid-cols-2 md:gap-0 md:py-14 md:pl-0">
              <span
                className="absolute left-0 top-[3.4rem] h-[15px] w-[15px] rounded-full border border-[var(--line-strong)] bg-ink md:left-1/2 md:-translate-x-1/2"
                aria-hidden
              >
                <span className="absolute inset-[4px] rounded-full bg-hbeta" />
              </span>

              <div
                className={
                  left
                    ? "md:pr-16 md:text-right"
                    : "md:order-2 md:pl-16"
                }
              >
                <p className="font-mono text-[10px] tracking-[0.3em] text-fog">
                  ENTRY {String(i + 1).padStart(2, "0")} · {m.person.toUpperCase()}
                </p>
                <p className="mt-2 font-display text-[clamp(3rem,7vw,5.6rem)] font-medium leading-none text-paper">
                  {m.year}
                </p>
                <p className="mt-3 font-display text-[20px] italic text-paper/85">
                  {m.name} — <span className="text-fog">{m.epithet}</span>
                </p>
              </div>

              <div className={left ? "md:order-2 md:pl-16 md:pt-2" : "md:pr-16 md:pt-2 md:text-right"}>
                <p className="max-w-[52ch] text-[15.5px] leading-[1.8] text-paper/80 md:inline">{EVENTS[m.key]}</p>
                <p
                  className={`mt-4 max-w-[52ch] border-l-2 border-hbeta/70 pl-4 text-[14px] leading-relaxed text-paper/65 ${
                    left ? "" : "md:ml-auto md:border-l-0 md:border-r-2 md:pl-0 md:pr-4"
                  }`}
                >
                  <span className="font-mono text-[9.5px] tracking-[0.26em] text-hbeta">WHAT IT WON </span>
                  <br />
                  {m.gained}
                </p>
              </div>
            </Reveal>
          );
        })}

        {/* full-width evidence strip after Bohr */}
        <Reveal className="relative grid gap-6 border-t border-[var(--line)] py-12 pl-10 md:grid-cols-[1fr_2fr] md:pl-0">
          <span
            className="absolute left-0 top-[3.9rem] h-[15px] w-[15px] rounded-full border border-[var(--line-strong)] bg-ink md:left-1/2 md:-translate-x-1/2"
            aria-hidden
          >
            <span className="absolute inset-[4px] rounded-full bg-halpha" />
          </span>
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-fog">EXHIBIT — THE EVIDENCE</p>
            <p className="mt-3 font-display text-[20px] italic leading-snug text-paper/85">
              Hydrogen’s visible fingerprint, predicted by rungs alone
            </p>
          </div>
          <div>
            <Spectrum showBalmer labelled height={8} />
            <p className="mt-3 font-mono text-[9.5px] leading-relaxed tracking-[0.16em] text-fog">
              THE BALMER SERIES — FOUR LINES THAT SHOULD NOT EXIST UNLESS ELECTRONS LIVE ON RUNGS.
              656.3 NM RED IS FIG. IV’S PHOTON, PAID OUT n=3 → n=2.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
