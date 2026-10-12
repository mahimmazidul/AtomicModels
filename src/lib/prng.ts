/* Deterministic pseudo-random helpers so drawings are stable per element. */

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Pt {
  x: number;
  y: number;
}

/** Golden-angle scatter inside a disc — organic but deterministic. */
export function discScatter(count: number, radius: number, seed: number, jitter = 0.16): Pt[] {
  const rand = mulberry32(seed);
  const pts: Pt[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const r = radius * Math.sqrt((i + 0.5) / count);
    const a = i * golden + rand() * 0.9;
    const jr = r * (1 + (rand() - 0.5) * jitter);
    pts.push({ x: Math.cos(a) * jr, y: Math.sin(a) * jr });
  }
  return pts;
}

/** Unit gaussian-ish sample (sum of uniforms), deterministic via rand. */
export function gasdev(rand: () => number) {
  return rand() + rand() + rand() - 1.5; // ~N(0, 0.3)
}
