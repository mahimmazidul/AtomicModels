import { Moon, Sun } from "lucide-react";
import { toggleTheme, useTheme } from "../lib/theme";
import { cn } from "../utils/cn";

/* The plate can be read as an ink drawing on paper, or a paper drawing on ink.
   Same instrument, both lights. */

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const dark = theme === "dark";
  const next = dark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} setting — currently ${theme}`}
      title={`Switch to ${next} setting (T)`}
      className={cn(
        "group inline-flex items-center gap-2 border border-[var(--line)] px-3 py-2 font-mono text-[9.5px]",
        "tracking-[0.24em] text-fog transition-colors hover:border-[var(--line-strong)] hover:text-paper",
        className,
      )}
    >
      <span className="relative grid h-3.5 w-3.5 place-items-center">
        <Sun
          size={13}
          className={cn(
            "absolute transition-all duration-500",
            dark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
          )}
        />
        <Moon
          size={13}
          className={cn(
            "absolute transition-all duration-500",
            dark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
          )}
        />
      </span>
      <span className="hidden sm:inline">{dark ? "DARK" : "LIGHT"}</span>
    </button>
  );
}
