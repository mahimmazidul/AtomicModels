import { ArrowUpRight } from "lucide-react";
import { padZ, type ElementData } from "../data/elements";
import { specimenOf } from "../data/specimens";

/* The specimen card: the object itself, not a drawing of it.

   Every figure in this instrument is a labelled schematic, so the photograph
   matters — it is the one thing on the stage that was not drawn by us. It
   comes from the element's Wikipedia article, by way of Wikimedia Commons,
   and carries its author and licence with it. */

export default function Specimen({ el }: { el: ElementData }) {
  const s = specimenOf(el.z);
  const hasPhoto = Boolean(s?.image);
  const credit = s?.artist ? `${s.artist} · ${s.license}` : s?.license || "Wikimedia Commons";

  return (
    <figure className="border border-[var(--line)] bg-bone text-ink">
      <div className="flex flex-col sm:flex-row">
        {/* the mat: always paper, in both settings */}
        <div className="shrink-0 border-b border-ink/20 bg-[#fbf9f2] p-3 sm:w-[224px] sm:border-b-0 sm:border-r">
          {hasPhoto ? (
            <img
              src={s!.image!}
              alt={`${el.name} — photograph of the element from Wikimedia Commons`}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full border border-[#0c0c0f]/12 object-cover"
            />
          ) : (
            <div className="grid aspect-square w-full place-items-center border border-dashed border-[#0c0c0f]/25 px-4">
              <span className="mat-ink-55 text-center font-mono text-[9px] leading-relaxed tracking-[0.18em]">
                NO PHOTOGRAPH ON FILE
                <br />
                <span className="opacity-80">NOTHING LEFT TO POINT A CAMERA AT</span>
              </span>
            </div>
          )}
          <figcaption className="mat-ink-50 mt-2.5 font-mono text-[9px] leading-relaxed tracking-[0.08em]">
            {hasPhoto ? credit : "EN.WIKIPEDIA.ORG · WIKIMEDIA COMMONS"}
          </figcaption>
        </div>

        {/* the readout, on the mounted slab */}
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="kicker kicker-ink">Specimen · from Wikipedia</span>
            <span className="font-mono text-[9.5px] tracking-[0.2em] text-ink/50">№ {padZ(el.z)}</span>
          </div>

          <p className="mt-3 font-display text-[14.5px] leading-relaxed text-ink/85">
            {s?.extract ??
              `${el.name} is a chemical element with symbol ${el.sym} and atomic number ${el.z}.`}
          </p>

          <p className="mt-3 border-l-2 border-ink/25 pl-3 font-mono text-[9.5px] leading-relaxed tracking-[0.1em] text-ink/70">
            WHAT YOU SEE ABOVE IS THE OBJECT ITSELF — NOT A DRAWING OF IT. THE FIGURES ELSEWHERE ARE
            SCHEMATICS AND SAY SO.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={s?.wiki ?? `https://en.wikipedia.org/wiki/${el.name}`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-ink/70 transition-colors hover:text-halpha"
            >
              READ THE ARTICLE <ArrowUpRight size={12} />
            </a>
            {s?.page && (
              <a
                href={s.page}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-ink/65 transition-colors hover:text-halpha"
              >
                IMAGE FILE + LICENCE <ArrowUpRight size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </figure>
  );
}
