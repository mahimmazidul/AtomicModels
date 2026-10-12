import { ArrowUp, ArrowUpRight } from "lucide-react";
import { InstrumentMark } from "./icons";
import Spectrum from "./Spectrum";

/** GitHub octocat mark (lucide dropped brand icons). */
function GithubMark({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.67.8.55A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

const COLS: { head: string; rows: [string, string][] }[] = [
  {
    head: "DATA",
    rows: [
      ["Standard atomic weights", "https://iupac.org/what-we-do/periodic-table-of-elements/"],
      ["Electrons-per-shell distributions", "https://en.wikipedia.org/wiki/Electron_shell"],
    ],
  },
  {
    head: "PLATES",
    rows: [
      ["Wikimedia Commons", "https://commons.wikimedia.org"],
      ["Licenses beneath each frame", "#plates"],
    ],
  },
  {
    head: "PROJECT",
    rows: [
      ["Source on GitHub", "https://github.com/mahimmazidul/AtomicModels"],
      ["MIT License", "https://github.com/mahimmazidul/AtomicModels/blob/main/LICENSE"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--line)]">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 sm:px-10 md:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="kicker mb-4">Colophon</p>
            <p className="max-w-[22ch] font-display text-[clamp(2rem,4.6vw,3.6rem)] font-light leading-[1.04]">
              Five drawings. One hundred eighteen specimens. <em className="italic text-hbeta">Zero guesses unlabelled.</em>
            </p>
          </div>
          <a
            href="#top"
            className="group inline-flex items-center gap-3 border border-[var(--line)] px-5 py-3 font-mono text-[10px] tracking-[0.26em] text-fog transition-colors hover:border-paper hover:text-paper"
          >
            BACK TO TOP <ArrowUp size={13} className="transition-transform group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="mt-16 grid gap-10 border-t border-[var(--line)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3 text-paper">
              <InstrumentMark size={26} />
              <span className="font-mono text-[11px] tracking-[0.3em]">ATOMIC MODELS</span>
            </div>
            <p className="mt-4 max-w-[30ch] text-[13.5px] leading-relaxed text-paper/60">
              An instrument for the indivisible — five honest drawings of the atom, 1803–1926.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.head}>
              <p className="font-mono text-[10px] tracking-[0.3em] text-fog">{c.head}</p>
              <ul className="mt-4 space-y-2.5">
                {c.rows.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1.5 text-[13.5px] text-paper/75 transition-colors hover:text-paper"
                    >
                      {label}
                      {href.startsWith("http") && (
                        <ArrowUpRight size={11} className="opacity-50 transition-opacity group-hover:opacity-100" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <Spectrum height={4} />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
          <p className="font-mono text-[10px] tracking-[0.18em] text-fog">
            © 2026 MAHIM MAZIDUL · MIT · STATIC SITE — NO TRACKING, NO COOKIES
          </p>
          <a
            href="https://github.com/mahimmazidul/AtomicModels"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-fog transition-colors hover:text-paper"
          >
            <GithubMark size={13} /> MAHIMAZIDUL / ATOMICMODELS
          </a>
        </div>
      </div>
    </footer>
  );
}
