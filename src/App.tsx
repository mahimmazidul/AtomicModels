import { useCallback, useEffect, useState } from "react";
import type { ModelKey } from "./data/models";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import Instrument from "./components/Instrument";
import Plates from "./components/Plates";
import Chronicle from "./components/Chronicle";
import Honesty from "./components/Honesty";
import Footer from "./components/Footer";
import { InstrumentMark } from "./components/icons";
import ThemeToggle from "./components/ThemeToggle";
import { toggleTheme } from "./lib/theme";

const NAV = [
  ["Instrument", "#instrument"],
  ["Plates", "#plates"],
  ["Chronicle", "#chronicle"],
  ["Honesty", "#honesty"],
] as const;

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-3.5 sm:px-10">
        <a href="#top" className="flex items-center gap-3 text-paper">
          <InstrumentMark size={26} />
          <span className="hidden font-mono text-[11px] tracking-[0.32em] xs:block sm:block">
            ATOMIC MODELS
          </span>
          <span className="hidden font-mono text-[9px] tracking-[0.24em] text-fog md:block">
            INSTRUMENT REV. II
          </span>
        </a>
        <nav className="flex items-center gap-5 sm:gap-8" aria-label="Sections">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} className="nav-link hidden md:inline-block">
              {label}
            </a>
          ))}
          <ThemeToggle className="md:ml-2" />
          <a
            href="#instrument"
            className="border border-paper/60 px-3.5 py-2 font-mono text-[9.5px] tracking-[0.24em] text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            OPERATE
          </a>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  const [z, setZ] = useState(26); // iron — a fine first specimen
  const [model, setModel] = useState<ModelKey>("bohr");

  /* T swaps ink and paper from anywhere outside a text field. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key.toLowerCase() === "t" && !e.metaKey && !e.ctrlKey && !e.altKey) toggleTheme();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pick = useCallback((zz: number) => {
    setZ(zz);
    document.getElementById("instrument")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-ink text-paper antialiased">
      <div className="grain" aria-hidden />
      <Header />
      <main>
        <Hero />
        <Ticker onPick={pick} />
        <Instrument z={z} setZ={setZ} model={model} setModel={setModel} />
        <Plates />
        <Chronicle />
        <Honesty />
      </main>
      <Footer />
    </div>
  );
}
