import { ArrowUpRight } from "lucide-react";
import { MODELS } from "../data/models";
import Reveal from "./Reveal";
import {
  IconBohr,
  IconDalton,
  IconQuantum,
  IconRutherford,
  IconThomson,
} from "./icons";

const MODEL_ICONS = {
  dalton: IconDalton,
  thomson: IconThomson,
  rutherford: IconRutherford,
  bohr: IconBohr,
  quantum: IconQuantum,
} as const;

/* The historical record itself — plates reproduced from Wikimedia Commons,
   matted and captioned like an archive box. */

export default function Plates() {
  return (
    <section id="plates" className="bg-bone py-24 text-ink md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-10">
        <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <div>
            <p className="kicker kicker-ink mb-4">№ 02 · The archive</p>
            <h2 className="font-display text-[clamp(2.4rem,5.4vw,4.2rem)] leading-[0.95] tracking-[-0.01em]">
              The record, <em className="slab-accent-cool font-light italic">as drawn</em>
            </h2>
          </div>
          <p className="max-w-[34ch] pb-1 font-mono text-[11px] leading-relaxed tracking-[0.06em] text-ink/55">
            FIVE PLATES FROM WIKIMEDIA COMMONS, REPRODUCED WITH THEIR AUTHORS’ CREDITS. THE ERA’S OWN
            HAND — NOT OURS.
          </p>
        </Reveal>

        <div className="columns-1 gap-8 sm:columns-2 xl:columns-3 [&>*]:mb-8">
          {MODELS.map((m, i) => {
            const Icon = MODEL_ICONS[m.key];
            return (
              <Reveal key={m.key} as="figure" delay={(i % 3) * 120} className="break-inside-avoid">
                <div className="plate-frame border border-ink/25 bg-[#fbf9f2] p-3 shadow-[0_10px_36px_-18px_rgba(12,12,15,0.3)]">
                  <div className="flex items-center justify-between px-1 pb-3 pt-1">
                    <span className="flex items-center gap-2.5">
                      <Icon size={17} className="mat-ink-70" />
                      <span className="mat-ink-70 font-mono text-[10px] tracking-[0.3em]">
                        PLATE {m.numeral}
                      </span>
                    </span>
                    <span className="mat-ink-50 font-mono text-[10px] tracking-[0.24em]">
                      {m.year}
                    </span>
                  </div>
                  <div className="mat-line overflow-hidden border bg-white">
                    <img
                      src={m.plate.src}
                      alt={m.plate.alt}
                      loading="lazy"
                      className="max-h-[420px] w-full object-contain p-4"
                    />
                  </div>
                  <figcaption className="px-1 pb-2 pt-4">
                    <p className="mat-ink-85 font-display text-[14.5px] italic leading-relaxed">
                      {m.plate.caption}
                    </p>
                    <div className="mat-rule mt-4 flex items-baseline justify-between gap-3 pt-3">
                      <span className="mat-ink-55 font-mono text-[9.5px] leading-relaxed tracking-[0.08em]">
                        {m.plate.credit} · {m.plate.license}
                      </span>
                      <a
                        href={m.plate.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mat-ink-70 inline-flex shrink-0 items-center gap-1 font-mono text-[9.5px] tracking-[0.16em] transition-colors hover:text-halpha"
                      >
                        COMMONS <ArrowUpRight size={11} />
                      </a>
                    </div>
                  </figcaption>
                </div>

                {/* side-note interleaved card after plate II & IV */}
                {(m.key === "thomson" || m.key === "bohr") && (
                  <div className="mt-8 border-l-2 border-ink pl-5 pr-2">
                    <p className="font-mono text-[9.5px] tracking-[0.3em] text-ink/50">MARGIN NOTE</p>
                    <p className="mt-2 font-display text-[16px] font-light leading-relaxed text-ink/85">
                      {m.key === "thomson"
                        ? "Atoms went from indivisible to composite in seven years. The archive keeps the wrong drawings on purpose — each one was the best picture of its decade."
                        : "Bohr’s rungs were the first picture that could be defeated by arithmetic. When a model starts making exact predictions, it is finally doing physics."}
                    </p>
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink/25 pt-5">
          <p className="font-mono text-[10px] tracking-[0.2em] text-ink/55">
            ALL PLATES SERVED FROM WIKIMEDIA COMMONS · LICENSES BENEATH EACH FRAME
          </p>
          <a
            href="https://commons.wikimedia.org"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-ink transition-colors hover:text-halpha"
          >
            VISIT THE COMMONS <ArrowUpRight size={12} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
