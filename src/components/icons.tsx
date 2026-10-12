/* Custom icon set — hand-drawn instrument marks for the five models.
   Stroke style, 24×24 grid, currentColor. (UI glyphs come from Lucide.) */

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  "aria-hidden": true,
});

export function IconDalton({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="8" />
      <path d="M6 8.6h12M4.6 12h14.8M6 15.4h12" opacity=".85" />
    </svg>
  );
}

export function IconThomson({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="7.8" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="8.4" cy="11.2" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="15.6" cy="11.2" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="10" cy="15.4" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="14" cy="15.4" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconRutherford({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <ellipse cx="12" cy="12" rx="9.4" ry="3.5" transform="rotate(-30 12 12)" />
      <ellipse cx="12" cy="12" rx="9.4" ry="3.5" transform="rotate(30 12 12)" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconBohr({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="1.35" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="12" cy="3.6" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="17.9" cy="17.9" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconQuantum({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="8.6" strokeDasharray="1.5 3" opacity=".8" />
      <circle cx="12" cy="12" r="4.6" fill="currentColor" stroke="none" opacity=".16" />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="12" cy="5.1" r=".85" fill="currentColor" stroke="none" />
      <circle cx="6.1" cy="13.4" r=".85" fill="currentColor" stroke="none" />
      <circle cx="17.6" cy="8.4" r=".85" fill="currentColor" stroke="none" />
      <circle cx="17.9" cy="16" r=".85" fill="currentColor" stroke="none" />
      <circle cx="8.2" cy="17.7" r=".85" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Logo — reticle + orbit, the “instrument” mark. */
export function InstrumentMark({ size = 28, ...p }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      aria-hidden
      {...p}
    >
      <circle cx="16" cy="16" r="11.5" opacity=".9" />
      <path d="M16 1.5v4M16 26.5v4M1.5 16h4M26.5 16h4" />
      <ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(-24 16 16)" opacity=".85" />
      <circle cx="16" cy="16" r="2.4" fill="#e5483c" stroke="none" />
      <circle cx="24.6" cy="11.4" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Fine measurement tick row, used inside rules & dividers. */
export function TickRow({ ticks = 40, className = "" }: { ticks?: number; className?: string }) {
  return (
    <svg className={className} width="100%" height="7" preserveAspectRatio="none" aria-hidden>
      {Array.from({ length: ticks }, (_, i) => (
        <line
          key={i}
          x1={`${(i / (ticks - 1)) * 100}%`}
          x2={`${(i / (ticks - 1)) * 100}%`}
          y1={7 - (i % 8 === 0 ? 7 : i % 4 === 0 ? 4.5 : 2.5)}
          y2="7"
          stroke="currentColor"
          strokeWidth="1"
          opacity={i % 8 === 0 ? 0.9 : 0.55}
        />
      ))}
    </svg>
  );
}
