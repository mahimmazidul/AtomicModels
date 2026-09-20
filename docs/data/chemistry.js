// Lightweight chemistry helpers used by both the app and the build step.
// No external dependencies.

// Noble-gas cores used in shorthand configuration notation, written as the full
// orbital occupation they represent.
const NOBLE_CORES = {
  He: '1s2',
  Ne: '1s2 2s2 2p6',
  Ar: '1s2 2s2 2p6 3s2 3p6',
  Kr: '1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6',
  Xe: '1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6',
  Rn: '1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 4f14 5d10 6s2 6p6'
};

const L_OF = { s: 0, p: 1, d: 2, f: 3 };
export const L_NAME = { 0: 's', 1: 'p', 2: 'd', 3: 'f' };

// Expand a shorthand configuration (which may contain [Noble] tokens) into a
// flat space-separated list of "nl<count>" tokens, e.g. "1s2 2s2 2p6".
export function expand(shorthand) {
  // Sanitize: remove leading '*' (unconfirmed configs) and fix missing spaces like "5d16s2" -> "5d1 6s2"
  let s = String(shorthand).replace(/^\*+/, '').trim();
  // Insert space between two subshell tokens stuck together: e.g. "5d16s2" -> "5d1 6s2"
  s = s.replace(/([spdf]\d+)(\d+[spdf])/g, '$1 $2');
  // Also handle "[Xe]5d1" -> "[Xe] 5d1"
  s = s.replace(/(\])(?=\d)/g, '$1 ');
  const tokens = s.split(/\s+/).filter(Boolean);
  const out = [];
  for (const tok of tokens) {
    const m = tok.match(/^\[(\w+)\]$/);
    if (m) {
      const core = NOBLE_CORES[m[1]];
      if (!core) throw new Error('Unknown noble-gas core: ' + tok);
      out.push(core);
    } else {
      out.push(tok);
    }
  }
  return out.join(' ');
}

// Parse a (possibly shorthand) configuration into an array of
// { n, l, count, label } subshells, ordered by increasing n then l.
export function parseSubshells(shorthand) {
  const full = expand(shorthand);
  const subs = [];
  for (const tok of full.trim().split(/\s+/).filter(Boolean)) {
    const m = tok.match(/^(\d+)([spdf])(\d+)$/);
    if (!m) throw new Error('Bad subshell token: ' + tok + ' in "' + shorthand + '"');
    const n = Number(m[1]);
    const l = L_OF[m[2]];
    const count = Number(m[3]);
    subs.push({ n, l, count, label: `${n}${m[2]}${count}` });
  }
  subs.sort((a, b) => (a.n - b.n) || (a.l - b.l));
  return subs;
}

// Total number of electrons described by a configuration.
export function electronCount(shorthand) {
  return parseSubshells(shorthand).reduce((s, x) => s + x.count, 0);
}

// Electrons per principal shell (index 0 => n=1), derived from the config.
export function shells(shorthand) {
  const subs = parseSubshells(shorthand);
  const maxN = subs.reduce((m, x) => Math.max(m, x.n), 0);
  const arr = new Array(maxN).fill(0);
  for (const x of subs) arr[x.n - 1] += x.count;
  return arr; // e.g. [2, 8, 1] for Na
}

// Highest principal quantum number occupied (the period).
export function period(shorthand) {
  return parseSubshells(shorthand).reduce((m, x) => Math.max(m, x.n), 0);
}

// A compact, human-readable configuration string with noble-gas shorthand.
export function formatConfig(shorthand) {
  return shorthand;
}
