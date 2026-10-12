import Reveal from "./Reveal";

/* The site’s editorial policy, restated as three rules of the instrument. */

const RULES = [
  {
    n: "01",
    title: "Label every schematic.",
    body: "No drawing here pretends to be a simulation. Each figure carries “simplified — not to scale” in its own frame, because a beautiful lie is still a lie.",
  },
  {
    n: "02",
    title: "Ship every model with its refutation.",
    body: "Each of the five drawings arrives with the experiment that killed it. The point of the archive is not the answers — it is how each answer earned the next question.",
  },
  {
    n: "03",
    title: "Never round reality.",
    body: "Standard weights stay IUPAC-exact; synthetic elements wear [brackets] and admit they have no stable weight. When a shell count is schematic, the figure says so.",
  },
];

export default function Honesty() {
  return (
    <section id="honesty" className="border-t border-[var(--line)] bg-ink-2/40">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 md:py-32">
        <Reveal className="mb-14 max-w-3xl md:mb-20">
          <p className="kicker mb-4">№ 04 · The policy</p>
          <h2 className="font-display text-[clamp(2.2rem,4.8vw,3.8rem)] leading-[1.02]">
            An instrument is honest or it is <em className="font-light italic text-halpha">decoration.</em>
          </h2>
        </Reveal>

        <div className="grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
          {RULES.map((r, i) => (
            <Reveal key={r.n} delay={i * 120} className="bg-ink p-8 md:p-10">
              <p className="font-mono text-[10px] tracking-[0.3em] text-hbeta">RULE {r.n}</p>
              <h3 className="mt-5 font-display text-[22px] font-medium leading-snug text-paper">
                {r.title}
              </h3>
              <p className="mt-4 text-[14.5px] leading-[1.8] text-paper/65">{r.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
