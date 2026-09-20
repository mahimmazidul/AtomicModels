// Metadata and explanatory text for the five historical / modern atomic models.
// All prose is intentionally concise and accessible. Visualizations are always
// labelled as simplified schematics, never as exact simulations.
//
// `kind` selects the Canvas renderer; `note(el)` returns a per-element
// limitation/significance paragraph so the UI never invents a precise simulation.

export const MODELS = [
  {
    id: 'dalton',
    kind: 'dalton',
    name: 'Dalton — Solid Sphere',
    year: '1803',
    principle:
      'John Dalton’s atomic theory held that each element is made of tiny, ' +
      'indivisible, identical spheres that combine in fixed whole-number ratios ' +
      'to form compounds. Mass, not internal structure, distinguished one element ' +
      'from another.',
    significance:
      'Dalton’s theory explained the laws of definite and multiple proportions ' +
      'and gave chemistry its first quantitative, particle-based foundation. It is ' +
      'still the right mental model for stoichiometry and ball-and-stick chemistry.',
    limitation:
      'Atoms are not indivisible: they contain protons, neutrons and electrons, ' +
      'and many elements occur as isotopes of different mass. The solid-sphere ' +
      'picture therefore cannot explain spectra, bonding, or radioactivity.',
    note(el) {
      return (
        `As a Dalton-style solid sphere, ${el.name} (${el.sym}) is shown as a single ` +
        `uniform ball carrying its atomic mass. This is a useful stoichiometric ` +
        `abstraction, but it conceals the subatomic structure that later models ` +
        `revealed and cannot represent the ${el.z} protons, the surrounding ` +
        `electrons, or isotope differences.`
      );
    }
  },
  {
    id: 'thomson',
    kind: 'thomson',
    name: 'Thomson — Plum Pudding',
    year: '1904',
    principle:
      'After the electron was discovered, J. J. Thomson proposed a positively ' +
      'charged sphere with negatively charged electrons embedded throughout it, ' +
      'like plums in a pudding. The total charge balanced to zero for a neutral atom.',
    significance:
      'Thomson’s model was the first to include subatomic particles and a ' +
      'neutral atom built from positive and negative charge. It directly motivated ' +
      'Rutherford’s scattering experiment.',
    limitation:
      'It cannot explain Ernest Rutherford’s 1909 observation that some alpha ' +
      'particles bounce straight back from a thin gold foil — evidence for a tiny, ' +
      'dense nucleus — nor the discrete line spectra of elements.',
    note(el) {
      return (
        `In the plum-pudding picture, ${el.name} (${el.sym}) is a diffuse positive ` +
        `blob with its ${el.z} electrons scattered inside. This arrangement keeps ` +
        `the atom neutral but leaves no concentrated nucleus, so it cannot explain ` +
        `large-angle scattering or why atoms emit and absorb only specific colours ` +
        `of light.`
      );
    }
  },
  {
    id: 'rutherford',
    kind: 'rutherford',
    name: 'Rutherford — Nuclear',
    year: '1911',
    principle:
      'Ernest Rutherford concluded from alpha-particle scattering that an atom is ' +
      'mostly empty space with a tiny, massive, positively charged nucleus at its ' +
      'centre; electrons orbit at a great distance, much like planets around the Sun.',
    significance:
      'The nuclear model introduced the nucleus and the modern concept of ' +
      'empty atomic volume. It explained scattering data and located essentially ' +
      'all of an atom’s mass in its centre.',
    limitation:
      'A classical orbiting electron should continuously radiate energy and spiral ' +
      'into the nucleus in a fraction of a second, so the model is dynamically ' +
      'unstable. It also cannot explain discrete atomic spectra.',
    note(el) {
      return (
        `Rutherford’s model places ${el.name}’s (${el.sym}) ${el.z} protons (and ` +
        `neutrons) in a minute central nucleus with electrons circling far away. ` +
        `It shows the atom’s emptiness correctly, but a classical orbit like this ` +
        `would collapse almost instantly and cannot reproduce the element’s ` +
        `characteristic spectrum.`
      );
    }
  },
  {
    id: 'bohr',
    kind: 'bohr',
    name: 'Bohr — Quantised Orbits',
    year: '1913',
    principle:
      'Niels Bohr proposed that electrons occupy fixed circular orbits with ' +
      'quantised energies and jump between them by absorbing or emitting a photon ' +
      'of a precise energy. Orbits are grouped into shells labelled by the ' +
      'principal quantum number n = 1, 2, 3, ….',
    significance:
      'Bohr’s model explained the hydrogen spectrum exactly and introduced ' +
      'quantisation into atomic structure. The shell concept remains a useful ' +
      'teaching and bookkeeping tool for electron arrangements.',
    limitation:
      'It works well only for hydrogen-like (one-electron) systems. For ' +
      'many-electron atoms it cannot predict energies, fine structure, or ' +
      'chemical behaviour accurately, and real orbitals are not simple circles.',
    note(el) {
      if (el.z === 1) {
        return (
          `Bohr’s model is essentially exact for hydrogen (${el.sym}): a single ` +
          `electron in a quantised orbit reproduces the observed spectrum. For any ` +
          `other element the orbiting-electron picture is only a teaching ` +
          `simplification, not the modern quantum description.`
        );
      }
      return (
        `Bohr’s orbiting-shell picture is a helpful schematic for ${el.name} ` +
        `(${el.sym}), but it cannot accurately describe a ${el.z}-electron atom. ` +
        `Electron–electron repulsion, subshell splitting and the wave-like nature ` +
        `of electrons mean real many-electron atoms need quantum mechanics, not ` +
        `fixed circular paths.`
      );
    }
  },
  {
    id: 'quantum',
    kind: 'quantum',
    name: 'Quantum — Probability Clouds',
    year: '1926',
    principle:
      'In the modern quantum-mechanical model, electrons are described by wave ' +
      'functions whose squared magnitude gives a probability density — the chance ' +
      'of finding an electron in a region of space. These form orbitals (s, p, d, f) ' +
      'rather than fixed paths.',
    significance:
      'Quantum mechanics correctly predicts spectra, bonding, magnetism and ' +
      'chemical periodicity for every element. The orbital picture underlies all ' +
      'of modern chemistry and materials science.',
    limitation:
      'Exact solutions exist only for hydrogen-like atoms. Many-electron atoms ' +
      'require approximation methods (Hartree–Fock, DFT) and inclusion of ' +
      'electron correlation, spin–orbit coupling and relativistic effects.',
    note(el) {
      const n = el.z;
      return (
        `For ${el.name} (${el.sym}) the figure shows schematic, clearly labelled ` +
        `probability clouds for occupied orbitals. They illustrate where electrons ` +
        `are likely to be found, not precise calculated distributions. A real ` +
        `${n}-electron atom needs numerical quantum-chemistry methods to treat ` +
        `electron–electron interactions accurately.`
      );
    }
  }
];

export const MODEL_BY_ID = new Map(MODELS.map((m) => [m.id, m]));

export function modelById(id) {
  return MODEL_BY_ID.get(id) || MODELS[3]; // default Bohr
}
