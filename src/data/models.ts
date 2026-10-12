/* The five models. Plate imagery is sourced from Wikimedia Commons
   (verified file pages — loaded via Special:FilePath so canonical names
   and redirects keep working), with attribution below. */

export type ModelKey = "dalton" | "thomson" | "rutherford" | "bohr" | "quantum";

export interface AtomicModel {
  key: ModelKey;
  numeral: string;
  year: number;
  person: string;
  name: string;
  epithet: string;
  idea: string; // one-line principle
  gained: string; // what it got right
  limit: string; // where it breaks — the site’s honesty policy
  plate: {
    src: string;
    href: string;
    credit: string;
    license: string;
    caption: string;
    alt: string;
  };
}

const commons = (file: string, width: number) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

const commonsPage = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;

export const MODELS: AtomicModel[] = [
  {
    key: "dalton",
    numeral: "I",
    year: 1803,
    person: "John Dalton",
    name: "Solid Sphere",
    epithet: "the billiard ball",
    idea: "Each element consists of tiny, indivisible, identical spheres; elements differ only in mass and combine in fixed whole-number ratios.",
    gained: "Explains conservation of mass and the law of definite proportions — chemistry becomes quantitative.",
    limit: "No internal structure at all — it cannot hear a spectrum, and it never saw the electron coming.",
    plate: {
      src: commons("A New System of Chemical Philosophy fp.jpg", 900),
      href: commonsPage("A New System of Chemical Philosophy fp.jpg"),
      credit: "J. Dalton, plate from “A New System of Chemical Philosophy”, 1808",
      license: "Public domain",
      caption:
        "Dalton’s own engraving: atoms of water, ammonia, nitrous gas and acids — compound atoms built from indivisible spheres.",
      alt: "Engraved plate of Dalton's atomic symbols, rows of circle diagrams with letters and dots, 1808",
    },
  },
  {
    key: "thomson",
    numeral: "II",
    year: 1904,
    person: "J. J. Thomson",
    name: "Plum Pudding",
    epithet: "the first subatomic particle",
    idea: "A diffuse sphere of positive charge with electrons embedded throughout, like plums in a pudding; the whole atom stays neutral.",
    gained: "Puts the electron — discovered in his own cathode-ray tube, 1897 — inside the atom for the first time.",
    limit: "No nucleus, and therefore no explanation for why alpha particles ricochet off gold foil.",
    plate: {
      src: commons("Plum pudding atom.svg", 800),
      href: commonsPage("Plum pudding atom.svg"),
      credit: "Fastfission, “Plum pudding atom”",
      license: "Public domain",
      caption:
        "The canonical schematic: negative corpuscles suspended in a uniform positive jelly — neutral overall, doomed by gold.",
      alt: "Diagram of the plum pudding model, a circle with small negative charges embedded inside",
    },
  },
  {
    key: "rutherford",
    numeral: "III",
    year: 1911,
    person: "Ernest Rutherford",
    name: "Nuclear Model",
    epithet: "mostly empty space",
    idea: "Nearly all the mass, and all the positive charge, sits in a nucleus one hundred-thousandth the atom’s width; electrons orbit it at a distance, like planets.",
    gained: "Reads the Geiger–Marsden gold-foil data correctly: one alpha in twenty thousand turns around.",
    limit: "Classical physics says orbiting charges radiate energy — every atom should collapse in a nanosecond. It stays silent on that.",
    plate: {
      src: commons("Geiger-Marsden experiment expectation and result.svg", 1100),
      href: commonsPage("Geiger-Marsden experiment expectation and result.svg"),
      credit: "Kurzon, “Geiger–Marsden experiment expectation and result”",
      license: "CC BY-SA 4.0",
      caption:
        "Expectation versus result: the pudding predicts gentle deflection; reality fires one alpha particle in twenty thousand straight back.",
      alt: "Two-panel diagram comparing the expected plum pudding scattering with the observed nuclear scattering of alpha particles",
    },
  },
  {
    key: "bohr",
    numeral: "IV",
    year: 1913,
    person: "Niels Bohr",
    name: "Quantised Orbits",
    epithet: "electrons on ladder rungs",
    idea: "Electrons occupy fixed circular orbits of quantised energy, n = 1, 2, 3… They emit or absorb light only when jumping rungs — never in between.",
    gained: "Derives the Balmer series of hydrogen to four significant figures — the spectrum becomes legible.",
    limit: "Exact only for one-electron atoms; it fines nothing heavier, and ignores fine structure entirely.",
    plate: {
      src: commons("Bohr atom model English.svg", 800),
      href: commonsPage("Bohr atom model English.svg"),
      credit: "Brighterorange, “Bohr atom model”",
      license: "CC BY-SA 3.0",
      caption:
        "An electron shed from n = 3 to n = 2 pays out the difference as one photon, hf — the red H-α line of hydrogen.",
      alt: "Bohr model diagram with quantized electron orbits labelled n=1, 2, 3 and a photon emitted during a transition",
    },
  },
  {
    key: "quantum",
    numeral: "V",
    year: 1926,
    person: "Schrödinger · Heisenberg · Born",
    name: "Probability Cloud",
    epithet: "the end of the path",
    idea: "The electron is a wave function; |ψ|² gives not a path but a probability density — orbitals s, p, d, f, not orbits.",
    gained: "Explains the entire periodic table, chemical bonding, and spin. Nothing in chemistry escapes it.",
    limit: "Many-electron atoms have no closed-form solution — every real answer is a numerical approximation. This instrument says so.",
    plate: {
      src: commons("Hydrogen Density Plots.png", 1100),
      href: commonsPage("Hydrogen Density Plots.png"),
      credit: "PoorLeno, “Hydrogen Density Plots”",
      license: "Public domain",
      caption:
        "Computed |ψ|² for the hydrogen orbitals: brightness is probability. Nothing here is a path — the orbit is over.",
      alt: "Grid of hydrogen atom orbital density plots showing probability clouds for different quantum numbers",
    },
  },
];

export const MODEL_BY_KEY = Object.fromEntries(MODELS.map((m) => [m.key, m])) as Record<
  ModelKey,
  AtomicModel
>;
